import morgan from "morgan";
const requestLogger = morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined');
const startupLog = (port, env) => {
    console.log(`Server runing on port ${port} [${env}]`);
}
export {requestLogger, startupLog};