import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import path from "node:path";
import prisma from "../db/pool";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

const authUser: RequestHandler = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(403).redirect("/");
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const getDash: RequestHandler = async (req, res, next) => {
  if (!req.user) throw new Error("No user!");
  const files = await prisma.file.findMany({
    where: {
      user_id: req.user.id,
      folder_id: null,
    },
  });
  const folders = await prisma.folder.findMany({
    where: {
      user_id: req.user.id,
    },
  });

  res.render("dashboard", {
    username: req.user ? req.user.username : "Unknown",
    folders,
    files,
  });
};

const getUpload: RequestHandler = (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");

    res.render("upload", { uploadLink: "/dashboard/upload" });
  } catch (error) {
    next(error);
  }
};

const postUpload = upload.single("file");

const logout: RequestHandler = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect("/");
  });
};

const getNewFolder: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    res.render("newFolder");
  } catch (error) {
    next(error);
  }
};

const createFolder: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");

    const newFolder = await prisma.folder.create({
      data: {
        name: req.body.name,
        user_id: req.user.id,
      },
    });
    res.redirect(`/dashboard/folders/${newFolder.id}`);
  } catch (error) {
    next(error);
  }
};

const readFolder: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        files: true,
      },
    });
    if (folder === null) throw new Error("No folder!");
    res.render("folder", {
      name: folder.name,
      files: folder.files,
      id: folder.id,
    });
  } catch (error) {
    next(error);
  }
};

const getFolderUpload: RequestHandler = (req, res, next) => {
  if (!req.user) throw new Error("No user!");
  res.render("upload", {
    uploadLink: `/dashboard/folders/${req.params.id}/upload`,
  });
};

const postFolderUpload: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    const name = req.body.name || crypto.randomUUID();
    await prisma.file.create({
      data: {
        name: name,
        url: req.file?.path || "",
        size: req.file?.size || 0,
        folder_id: req.params.id,
        user_id: req.user.id,
      },
    });
    res.redirect(`/dashboard/folders/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

const postDashUpload: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    const name = req.body.name || crypto.randomUUID();
    await prisma.file.create({
      data: {
        name: name,
        url: req.file?.path || "",
        size: req.file?.size || 0,
        user_id: req.user.id,
      },
    });
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

const deleteFolder: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    await prisma.folder.delete({
      where: {
        id: req.params.id,
      },
    });
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

const getFile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) throw new Error("No user!");
    const file = await prisma.file.findUnique({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    if(!file) throw new Error("No file!");
    res.render("file", {name: file.name, size: file.size, id: file.id});
  } catch (error) {}
};

const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: req.params.id
      }
    });
    if(!file) throw new Error('No File!');
    res.download(file.url), file.name, (error:any) => {
      next(error);
    };
  } catch (error) {
    next(error);
  }
}

const deleteFile: RequestHandler = async (req, res, next) => {
  try {
    const file = await prisma.file.delete({
      where: {
        id: req.params.id
      }
    });
    if(!file) throw new Error('No File!');
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
}
const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.redirect('/');
}

export default {
  getDash,
  getUpload,
  postUpload,
  logout,
  createFolder,
  readFolder,
  getNewFolder,
  getFolderUpload,
  postFolderUpload,
  deleteFolder,
  authUser,
  getFile,
  downloadFile,
  deleteFile, 
  handleError,
  postDashUpload
};
