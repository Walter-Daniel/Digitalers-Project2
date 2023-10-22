import Image from '../model/image.schema.js'
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config( process.env.CLOUDINARY_URL )

export const getImages = async( req, res ) => {
    try {
        let searchCriteria = {};
        const { id } = req.params; 
 
         if (id) {
             searchCriteria = {
                 notes : {
                     _id : id
                 }
             }   
         };
 
         const [ images, total ] = await Promise.all([
             Image.find(searchCriteria).populate
                                         .collation({ locale: 'es' }),   
             Image.find(searchCriteria).countDocuments()
         ]);
         
         res.status(200).json({
             ok: true,
             msg: 'Imagenes obtenidas',
             images,
             total,
         });       
     
    } catch (error) {
 
             res.status(400).json({
                 ok: false,
                 msg: 'Error al obtener las imagenes'
             });
    }
}

export const uploadImagesCloudinary = async(req, res ) => {

    const imgPath = req.files.image.tempFilePath

    if (uploadedFile.mimetype !== 'image/jpeg') {
        return res.status(400).send('Only JPG files are allowed.');
    }

    // const res =  await cloudinary.uploader.upload(imgPath);

    // const user = await User.findByIdAndUpdate( id, secure_url, rest);


    // cloudinary.uploader.upload()
};

const deleteImagesCloudinary = async(req, res ) => {

    const imageId = req.params.id;
    try {
        const imageToDelete = await Image.findById( imageId );
        if ( !imageToDelete ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró una imagen con ese id'
            })
        };

        await cloudinary.uploader.destroy( imageToDelete.title );
        await Image.findByIdAndDelete( imageToDelete );

        res.json({
            ok: true,
            msg: 'Imagen borrada',
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });    
    }; 
};
