if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://keerthi:nk1708@ds243295.mlab.com:43295/vidjot-prod'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}