/**
 * Required External Modules
 */
import * as dotenv from 'dotenv'
import express, { urlencoded, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middleware/error.middleware'
import { notFoundHandler } from './middleware/not-found.middleware'
import { RegisterRoutes } from '../build/routes'

dotenv.config()

/**
 * App Variables
 */

export const app = express()

/**
 *  App Configuration
 */
app.use(express.json())
app.use(
  urlencoded({
    extended: true,
  })
)
app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))
app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  const newLocal = '../build/swagger.json'
  res.send(swaggerUi.generateHTML(await import(newLocal)))
})
RegisterRoutes(app)

app.use(notFoundHandler)
app.use(errorHandler)
/**
 * Server Activation
 */
