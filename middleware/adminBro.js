const addCreationDate = (req, res, next) => {
  console.log(req.method);
  if(req.method == 'POST') {
    // console.log(req);
  }
  next();
};

module.exports = addCreationDate;