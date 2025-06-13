import { useQuery } from 'wasp/client/operations';
import { fetchCompletedTasks, fetchProfile, updateProfile } from 'wasp/client/operations';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';

export default function ResumePage() {
  const { data: user } = useAuth();
  const { data: completedTasks, isLoading: loadingTasks, error: tasksError } = useQuery(fetchCompletedTasks);
  const { data: resumeData, isLoading: loadingProfile, error: profileError } = useQuery(fetchProfile);

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    title: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
  });

  const resumeRef = useRef();

  useEffect(() => {
    if (resumeData) {
      setProfile(resumeData);
    }
  }, [resumeData]);

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Skills management functions
  const skillSuggestions = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'React', 'Node.js', 
    'Express.js', 'Next.js', 'Vue.js', 'Angular', 'HTML/CSS', 'SQL',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'C++', 'C#', 'Go', 'Rust',
    'PHP', 'Ruby', 'Django', 'Flask', 'Spring Boot', 'GraphQL', 'REST APIs'
  ];

  const getSkillsArray = (skillsString) => {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  };

  const addSkill = (skill) => {
    const currentSkills = getSkillsArray(profile.skills);
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      handleProfileUpdate('skills', newSkills);
    }
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = getSkillsArray(profile.skills);
    const newSkills = currentSkills.filter(skill => skill !== skillToRemove).join(', ');
    handleProfileUpdate('skills', newSkills);
  };

  const handleExportPDF = () => {
    if (window.print) {
      window.print();
    }
  };

  const handleExportJSON = () => {
    const resumeData = {
      profile,
      completedTasks: completedTasks?.map(task => ({
        title: task.title,
        repository: task.repo,
        description: task.description,
        summary: task.summary,
        prUrl: task.prUrl,
        completedAt: task.createdAt,
      })) || []
    };

    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'resume-data.json');
    linkElement.click();
  };

  const handleToggleEdit = async () => {
    if (editMode) {
      try {
        await updateProfile(profile);
        console.log('Profile saved.');
      } catch (err) {
        console.error('Failed to save profile:', err);
      }
    }
    setEditMode(!editMode);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loadingTasks || loadingProfile) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (tasksError || profileError) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error loading data</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Actions */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>📄 My Resume</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleToggleEdit} style={buttonStyle(editMode ? 'primary' : 'neutral')}>
            {editMode ? '✅ Save' : '✏️ Edit'}
          </button>
          <button onClick={handleExportPDF} style={buttonStyle()}>
            📄 Export PDF
          </button>
          <button onClick={handleExportJSON} style={buttonStyle()}>
            💾 Export Data
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div ref={resumeRef} style={resumeContainer(editMode)} className="resume-content">
        <header style={{ borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{user?.username || 'Your Name'}</h1>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.2rem', color: '#666' }}>
            {editMode ? (
              <input 
                type="text" 
                value={profile.title || ''} 
                onChange={e => handleProfileUpdate('title', e.target.value)} 
                style={inputStyle()}
              />
            ) : profile.title}
          </h2>
          <p style={{ margin: 0 }}>{user?.email}</p>
        </header>

        {/* Summary */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionHeader}>Professional Summary</h3>
          {editMode ? (
            <textarea
              value={profile.summary || ''}
              onChange={(e) => handleProfileUpdate('summary', e.target.value)}
              style={inputStyle(true)}
              placeholder="Enter your professional summary..."
            />
          ) : (
            <p>{profile.summary || 'No summary provided yet.'}</p>
          )}
        </section>

        {/* Skills */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionHeader}>Technical Skills</h3>
          {editMode ? (
            <div>
              {/* Skill Tags Display */}
              <div style={{ marginBottom: '1rem' }}>
                {getSkillsArray(profile.skills).map((skill, index) => (
                  <span key={index} style={skillTagStyle}>
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      style={removeButtonStyle}
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Skill Suggestions */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
                  💡 Click to add popular skills:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skillSuggestions
                    .filter(skill => !getSkillsArray(profile.skills).includes(skill))
                    .map(skill => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      style={suggestionButtonStyle}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom Skill Input */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Add custom skill..."
                  style={{ ...inputStyle(), flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const skill = e.target.value.trim();
                      if (skill) {
                        addSkill(skill);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Press Enter to add</span>
              </div>
            </div>
          ) : (
            <div>
              {getSkillsArray(profile.skills).length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {getSkillsArray(profile.skills).map((skill, index) => (
                    <span key={index} style={displaySkillTagStyle}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontStyle: 'italic', color: '#888' }}>No skills listed yet.</p>
              )}
            </div>
          )}
        </section>

        {/* Contributions */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionHeader}>Open Source Contributions</h3>
          {completedTasks && completedTasks.length > 0 ? completedTasks.map(task => (
            <div key={task.id} style={{ borderLeft: '3px solid #007acc', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{task.title}</h4>
              <p style={{ margin: '0.25rem 0', color: '#666', fontStyle: 'italic' }}>
                {task.repo} • {formatDate(task.createdAt)}{' '}
                {task.prUrl && (
                  <>
                    • <a href={task.prUrl} target="_blank" rel="noreferrer" style={{ color: '#007acc' }}>View Pull Request</a>
                  </>
                )}
              </p>
              <p><strong>Contribution:</strong> {task.summary}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                {task.description?.slice(0, 200)}...
              </p>
            </div>
          )) : (
            <p style={{ fontStyle: 'italic', color: '#888' }}>No contributions yet.</p>
          )}
        </section>

        {/* Experience */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionHeader}>Experience</h3>
          {editMode ? (
            <textarea
              value={profile.experience || ''}
              onChange={(e) => handleProfileUpdate('experience', e.target.value)}
              style={inputStyle(true)}
              placeholder="Enter your work experience..."
            />
          ) : (
            <p>{profile.experience || 'No experience listed yet.'}</p>
          )}
        </section>

        {/* Education */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={sectionHeader}>Education</h3>
          {editMode ? (
            <textarea
              value={profile.education || ''}
              onChange={(e) => handleProfileUpdate('education', e.target.value)}
              style={inputStyle(true)}
              placeholder="Enter your education background..."
            />
          ) : (
            <p>{profile.education || 'No education information provided yet.'}</p>
          )}
        </section>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-content, .resume-content * {
            visibility: visible;
          }
          .resume-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            font-size: 12pt;
            line-height: 1.4;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}

/* === Helper Styles === */

const resumeContainer = (editMode) => ({
  backgroundColor: 'white',
  color: 'black',
  padding: '2rem',
  borderRadius: editMode ? '8px' : '0',
  border: editMode ? '1px solid var(--color-border)' : 'none',
  minHeight: '11in',
  fontFamily: 'Georgia, serif',
  lineHeight: '1.6',
});

const sectionHeader = {
  fontSize: '1.4rem',
  marginBottom: '0.5rem',
  color: '#333',
};

const inputStyle = (multiline = false) => ({
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  resize: multiline ? 'vertical' : 'none',
  minHeight: multiline ? '80px' : undefined,
  fontSize: '1rem',
  fontFamily: 'inherit',
});

const buttonStyle = (variant = 'neutral') => ({
  padding: '0.5rem 1rem',
  backgroundColor: variant === 'primary' ? 'var(--color-primary)' : 'var(--color-border)',
  color: variant === 'primary' ? 'var(--color-on-primary)' : 'var(--color-foreground)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem'
});

const skillTagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  padding: '0.25rem 0.5rem',
  borderRadius: '12px',
  fontSize: '0.875rem',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
  border: '1px solid #bbdefb'
};

const displaySkillTagStyle = {
  display: 'inline-block',
  backgroundColor: '#f5f5f5',
  color: '#333',
  padding: '0.25rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.875rem',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
  border: '1px solid #ddd'
};

const removeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#1976d2',
  marginLeft: '0.5rem',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '0',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const suggestionButtonStyle = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  color: '#495057',
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#e9ecef',
    borderColor: '#adb5bd'
  }
};