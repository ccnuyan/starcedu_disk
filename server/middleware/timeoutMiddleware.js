 const haltOnTimedout = (req, res, next) => {
   if (!req.timedout) {
     next();
   } else {
     res.status(503).send({
       code: '503',
       message: 'request timeout',
     });
   }
 };

 export default haltOnTimedout;
