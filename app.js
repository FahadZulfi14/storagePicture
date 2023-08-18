import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, addDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyBzmIcyfr-4HRakxgQIrYfmIxNRT1Pn3sU",
  authDomain: "signup-fahad.firebaseapp.com",
  projectId: "signup-fahad",
  storageBucket: "signup-fahad.appspot.com",
  messagingSenderId: "189246209527",
  appId: "1:189246209527:web:5f16158dcd3750ed4f42f2"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();




//   html input get here ------------------- 


let submit = document.getElementById('submit');

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const mountainsRef = ref(storage, `images/student/${file.name}`);
    const uploadTask = uploadBytesResumable(mountainsRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);

        });
      }
    );
  })
}




submit.addEventListener('click', async () => {
  let fnameInput = document.getElementById('fnameInput');
  let lastNameInput = document.getElementById('LastNameInput');
  let cityInput = document.getElementById('cityInput');
  let file = document.getElementById('fileInput');
  try {
    const res = await uploadFile(file.files[0])

    let students = {
      first: fnameInput.value,
      last: lastNameInput.value,
      city: cityInput.value,
      image: res
    }
    // ------------------------------for add date in firestore--
    try {
      const docRef = await addDoc(collection(db, "students"), {
        ...students,

      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    // ------------------------------for get date firestore--






  } catch (error) {
    console.log(error)

  }
  let load = ()=> {
    let name = document.getElementById('fnameOut');
    let lastName = document.getElementById('LastNameOut');
    let city = document.getElementById('cityOut');
    let img = document.getElementById('img');
  
  
  
    
    onSnapshot(collection(db, "students"), (data) => {
      data.docChanges().forEach((change) => {
        console.log(change.doc.data());
        name.value=change.doc.data().first;
        lastName.value=change.doc.data().last;
        city.value=change.doc.data().city;
        img.src=change.doc.data().image;
    
      })
    });
    
  }
  load()
  
})

