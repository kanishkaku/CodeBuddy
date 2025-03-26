import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with open source contributions?",
    answer: "Start by exploring the 'Beginner' difficulty tasks on our platform. These are specifically chosen to be approachable for newcomers. Also, check out our Learning Center for guides on Git, GitHub, and making your first pull request."
  },
  {
    question: "How do I add completed tasks to my resume?",
    answer: "When you complete a task, go to the task details page and click 'Mark as Completed'. You'll be prompted to add details about your contribution, such as the pull request URL. Once saved, the contribution will automatically appear in your resume under the 'Open Source Contributions' section."
  },
  {
    question: "Can I customize my resume format?",
    answer: "Yes! On the My Resume page, you can edit your resume content and choose different display options. We also plan to add multiple resume templates in the future to give you more design flexibility."
  },
  {
    question: "How are task difficulty levels determined?",
    answer: "Task difficulty is assessed based on the technical complexity, estimated time to complete, and prerequisite knowledge required. Beginner tasks typically require basic programming knowledge, intermediate tasks require some domain expertise, and advanced tasks involve complex systems or performance optimization."
  },
  {
    question: "Can I suggest new open source projects or tasks?",
    answer: "Absolutely! We welcome suggestions for new projects. Please use the contact form in the Help Center to submit your recommendations, including links to the project repositories and specific issues that would be appropriate for our users."
  },
  {
    question: "How do I track my progress?",
    answer: "Your dashboard displays your current level, tasks completed, and resume completion percentage. As you complete more tasks, your level will advance from Beginner to Intermediate and finally to Advanced, reflecting your growing open source experience."
  }
];

export default function HelpCenter() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-500">
          Get answers to common questions and learn how to make the most of OSResume.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Common questions and answers</CardDescription>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Connect with other contributors</CardDescription>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help with specific issues</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Answers to the most common questions about using OSResume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            If you couldn't find an answer to your question, please contact our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Our team is available to help you with any questions or issues you may have about using OSResume.
            We typically respond within 24 hours on business days.
          </p>
          <p className="flex items-center text-primary">
            <Mail className="h-4 w-4 mr-2" />
            support@osresume.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
