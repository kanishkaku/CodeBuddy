import cors from 'cors'
import { config } from 'wasp/server'

export const serverMiddlewareFn = (middlewareConfig) => {
    // Example of adding extra domains to CORS.
    middlewareConfig.set('cors', cors({ origin: [config.frontendUrl, 'https://forgemycode.com', 'https://www.forgemycode.com', 'https://server-production-cf69.up.railway.app'] }))
    return middlewareConfig
}