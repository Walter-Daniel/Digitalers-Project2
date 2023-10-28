import { request, response } from 'express';
import Image from '../model/image.schema.js'
import { v2 as cloudinary } from 'cloudinary'
import User from '../model/user.schema.js';
import Doctor from '../model/doctor.schema.js';


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
    const { image } = req.files
    console.log(image)

    try {
        
        const {id} = req.params;
        const { image } = req.files

        const { tempFilePath } = image;
        const user = await User.findById( id );
        const doctor = await Doctor.findById(id);
        console.log(user, doctor)
        if(user){
            if(user.image){
                const nameArr = user.image.split('/');
                const name = nameArr[nameArr.length -1];
                const [public_id] = name.split('.');
                cloudinary.uploader.destroy(public_id);
            }
    
            const { secure_url } =  await cloudinary.uploader.upload(tempFilePath);
            user.image = secure_url;
            await user.save();
            req.flash('alert-success', 'La imagen se subió con éxito')
            return res.redirect(`/user/profile/update/${id}`)
        }else if(doctor){
            if(doctor.image){
                const nameArr = doctor.image.split('/');
                const name = nameArr[nameArr.length -1];
                const [public_id] = name.split('.');
                cloudinary.uploader.destroy(public_id);
            }
    
            const { secure_url } =  await cloudinary.uploader.upload(tempFilePath);
            doctor.image = secure_url;
            await doctor.save();
            req.flash('alert-success', 'La imagen se subió con éxito')
            return res.redirect(`/doctor/${id}`)
        }else{
            req.flash('alert-warning', `No se encontro usuario con el id: ${id}`)
            res.redirect(`/profile`)  
        }
    } catch (error) {
        req.flash('alert-warning', `${error.message}`)
        res.redirect(`/profile`)
    }
};
