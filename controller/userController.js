const getAllUsers = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const getUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const deleteUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const updateUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

const createUser = (req, res) => {
  res.send(200).json({
    status: 'berhasil',
    message: 'berhasil mendapatkan semua user',
  });
};

module.exports = { createUser, updateUser, deleteUser, getAllUsers, getUser };
