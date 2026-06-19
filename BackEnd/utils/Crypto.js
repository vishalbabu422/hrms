const CryptoJS = require("crypto-js");


const SECRET_KEY = process.env.REACT_APP_COOKIE_SECRET_KEY; 

console.log('key ',SECRET_KEY);

module.exports.encryptCookieold = (data) => {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex); 
  };


  // Encrypt function
  module.exports.encryptCookie = (data) => {
   // const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Ensure correct key length
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, ' '));  // Ensure 16 bytes (128-bit)

    const encrypted = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    // Return the encrypted data in Hex format
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);  
};

// Decrypt function
module.exports.decryptCookie = (encryptedData) => {

  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, ' '));  // Ensure correct key length

    console.log('Encrypted Data:', encryptedData);

    // Convert the encrypted data from Hex to WordArray
    const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);

   // console.log('encryptedHexStr Data:', encryptedHexStr);



  try {
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: encryptedHexStr },
          key,
          {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
          }
      );

      // Convert the decrypted WordArray to a UTF-8 string
      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Log the decrypted data to debug
      console.log('Decrypted Data:', decryptedData);
      
      // Check if decrypted data is empty
      if (!decryptedData) {
          throw new Error('Decrypted data is empty');
      }
      return decryptedData;
  } catch (error) {
      console.error('Decryption Error:', error);
      throw new Error('Failed to decrypt data');
  }
};


  // Decrypt function
module.exports.decryptCookieolddd = (encryptedData) => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData); // Convert hex to WordArray
  console.log('srikant encryptedData   ',encryptedData);
  const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedHexStr },
      key,
      {
          mode: CryptoJS.mode.ECB, // Same mode as in encryption
          padding: CryptoJS.pad.Pkcs7, // Same padding scheme
      }
  );

  // Return the decrypted data as a UTF-8 string
  return decrypted.toString(CryptoJS.enc.Utf8);
};


// const CryptoJS = require("crypto-js");


// const SECRET_KEY = process.env.REACT_APP_COOKIE_SECRET_KEY; 

// console.log('key ',SECRET_KEY);

// module.exports.encryptCookieold = (data) => {
//     const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
//     const encrypted = CryptoJS.AES.encrypt(data, key, {
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//     return encrypted.ciphertext.toString(CryptoJS.enc.Hex); 
//   };


//   // Encrypt function
//   module.exports.encryptCookie = (data) => {try{
//     const stringData=typeof data == "object" ? JSON.stringify(data) : data;
//   const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Ensure correct key length
// // const key = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, ' '));  // Ensure 16 bytes (128-bit)

//  const encrypted = CryptoJS.AES.encrypt(data, key, {
//      mode: CryptoJS.mode.ECB,
//      padding: CryptoJS.pad.Pkcs7
//  });
 
//  // Return the encrypted data in Hex format
//  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
//   }
//   catch(error){
//     console.error("enc error", error);
//     return null;
//   }
     
// };

// // Decrypt function
// module.exports.decryptCookie = (encryptedData) => {

//   try{
//     if(!encryptedData || typeof encryptedData!=="string"){
//       console.error("invalid type")
//       return null;
//     }

//     const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);  // Ensure correct key length
//     const bytes = CryptoJS.AES.decrypt(
//       {ciphertext: CryptoJS.enc.Hex.parse(encryptedData)},
//       key,
//       {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//       }
//     );

//       const decryptedText=bytes.toString(CryptoJS.enc.Utf8);
//       return decryptedText ? JSON.parse(decryptedText): null;

//   }

//    catch (error) {
//       console.error('Decryption Error:', error);
//       throw new Error('Failed to decrypt data');
//   }
// };


//   // Decrypt function
// module.exports.decryptCookieolddd = (encryptedData) => {
//   const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
//   const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData); // Convert hex to WordArray
//   console.log('srikant encryptedData   ',encryptedData);
//   const decrypted = CryptoJS.AES.decrypt(
//       { ciphertext: encryptedHexStr },
//       key,
//       {
//           mode: CryptoJS.mode.ECB, // Same mode as in encryption
//           padding: CryptoJS.pad.Pkcs7, // Same padding scheme
//       }
//   );

//   // Return the decrypted data as a UTF-8 string
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };




