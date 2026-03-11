const router = require('express').Router();
const { getAll, getOne, create, update, remove, getCategories, getSummary } = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');

router.use(auth);

router.get('/categories', getCategories);
router.get('/summary', getSummary);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
