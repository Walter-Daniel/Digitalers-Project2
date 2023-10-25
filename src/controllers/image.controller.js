import { request, response } from 'express';
import Image from '../model/image.schema.js'
import { v2 as cloudinary } from 'cloudinary'
import User from '../model/user.schema.js';


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});
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

export const uploadImagesCloudinary = async(req=request, res=response ) => {

    try {
        
        const {id} = req.params;
        const { image } = req.files

        const allowedExtensions = ['.jpg', '.jpeg'];
        const fileExtension = image.name.substring(image.name.lastIndexOf('.')).toLowerCase();

        // if (!allowedExtensions.includes(fileExtension)) {
        //     req.flash('alert-danger','Extensión no válida, intenta con ".png, .jpg, jpeg"');
        //     res.redirect(`/user/profile/update/${id}`)
        // }

        res.json({
            msg:'No llego la cosita'
        })


        // const { tempFilePath } = image;

        // const user = await User.findById( id );

       
        // if (mimetype !== 'image/jpeg') {
        //     req.flash('alert-error', 'Su cuenta ha sido creada con éxito')
        //     res.redirect(`/user/profile/update/${id}`)
        // }

        // //Limpiar imagenes previas
        // if(user.image){
        //     const nameArr = user.image.split('/');
        //     const name = nameArr[nameArr.length -1];
        //     const [public_id] = name.split('.');
        //     cloudinary.uploader.destroy(public_id);
        // }

        // const { secure_url } =  await cloudinary.uploader.upload(tempFilePath);
        // user.image = secure_url;
        // await user.save();
        // if(user.role === 'USER_ROLE'){
        //     return res.redirect(`/user/profile/update/${id}`)
        // }
    } catch (error) {
        res.json(error)
        
    }
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
