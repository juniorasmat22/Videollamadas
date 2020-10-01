const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const router = Router();

router.get('/', (req, res) => {
    //console.log(uuidv4());
    res.redirect(`/${uuidv4()}`);
});
router.get('/:room', (req, res) => {
    res.render('room',{roomId:req.params.room});
});
module.exports = router;