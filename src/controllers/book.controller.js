const { books, users } = require('../models');
const cloudinary = require('../utils/cloudinary');

const addBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, description, category_id } = req.body;

    const user = await users.findOne({
      where: { id: userId },
    });

    if (user.role !== 'admin')
      return res.status(403).send({
        message: 'forbidden, only admin can access',
      });

    if (!title || !req.file.path || !author || !description || !category_id)
      return res.status(400).send({
        message: 'all field must be filled!',
      });

    const result = await cloudinary.uploader.upload(req.file.path);

    await books.create({
      title: title,
      image: result.secure_url,
      author: author,
      description: description,
      category_id: category_id,
    });

    res.status(201).send({
      messsage: 'book added successfully',
    });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};

const allBooks = async (req, res) => {
  try {
    const result = await books.findAll();

    return res.status(200).send({
      message: 'data retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const bookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const result = await books.findOne({
      where: { id: bookId },
    });

    if (result == null)
      return res.status(404).send({
        message: 'data not found',
        data: result,
      });

    return res.status(200).send({
      message: 'data retrieved successfully',
      dasta: result,
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

module.exports = { allBooks, bookById, addBook };
