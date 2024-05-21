

//  l’appel à l’API avec fetch pour recuperer les données 

// fonction pour recupérer le tableau des travaux (works)

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();

}
getWorks();




// affichage des travaux 

const gallery = document.querySelector(".gallery");

async function affichageWorks() {
  const works = await getWorks();

 // supprimez du html les travaux déja existant 

 gallery.innerHTML = "";
 

 works.forEach((work) => {
  createWorks(work);
});

}
affichageWorks();


function createWorks(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
 
}



// ***Affichage des boutons par categorie***//

// récupérer les categories et les afficher 

const filters = document.querySelector(".filters")

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
 }
 getCategorys();


 async function CategorysButtons() {
  const categorys = await getCategorys();
  categorys.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = category.name;
      btn.id = category.id;
      filters.appendChild(btn);
  });
}
CategorysButtons();

// filtrer au click sur le bouton par catégorie

async function filterCategory() {
  const images = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const btnId = e.target.id;
        gallery.innerHTML = "";
          if (btnId !== "0") {
            const triImages = images.filter((work) => {
              return work.categoryId == btnId;
             });
             triImages.forEach((work) => {
                createWorks(work);
             })
        }else {
          affichageWorks();
        }
      });
  });
}

filterCategory();


/**** Modals****/


const loged =  window.sessionStorage.loged
const logout = document.querySelector("header nav .logout");
const modifier = document.querySelector(".modifier ");
const containerModals = document.querySelector(".container-modals");
const closeModals = document.querySelector(".container-modals .fa-xmark");
const projetModal = document.querySelector(".projet-modal");
const admin = document.querySelector(".admin");




// Si l'utilisateur est connecté

if (loged == "true") {
  admin.style.display = "flex";
  logout.textContent = "logout";
  modifier.style.display = "flex";
  logout.addEventListener("click", () => {
    window.sessionStorage.loged = false;
  }); 
  
}


  // affichage de la premiere modal au click sur modifier


   modifier.addEventListener("click", () => {
    containerModals.style.display = "flex";
});

closeModals.addEventListener("click", () => {
    containerModals.style.display = "none";
});


containerModals.addEventListener("click", (e) => {
    if (e.target.className == "container-modals") {
        containerModals.style.display = "none";
    }
});


 /* Affichage  galerie  modale 1 */
 
 
 async function displayGalerieModal() {
  projetModal.innerHTML = "";
  const projetWork = await getWorks();
  projetWork.forEach(projet => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const span = document.createElement("span");
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can");
      trash.id = projet.id;

      
      trash.addEventListener("click", () =>  {
         
          const token = window.sessionStorage.getItem("token");
          fetch(`http://localhost:5678/api/works/${projet.id}`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`
              }
          })
          .then (data => {
              figure.remove();

              affichageWorks();
          })
          
      })

      img.src = projet.imageUrl;
      span.appendChild(trash);
      figure.appendChild(span);
      figure.appendChild(img);
      projetModal.appendChild(figure);
  });
}
displayGalerieModal();


// affichge modal 2


const btn1 = document.querySelector(".button-modal-1");
const modalAjoutPhoto = document.querySelector(".modal-ajout");
const modalGaleriePhoto = document.querySelector(".modal-projet");
const arrowLeft = document.querySelector(".fa-arrow-left");
const closeModal2 = document.querySelector(".modal-ajout .fa-xmark");

function displayModal2() {
  btn1.addEventListener("click", ()=>{
    modalAjoutPhoto.style.display = "flex";
    modalGaleriePhoto.style.display = "none";
  });
arrowLeft.addEventListener("click", ()=>{
  modalAjoutPhoto.style.display = "none";
  modalGaleriePhoto.style.display = "flex";
});

closeModal2.addEventListener("click", ()=>{
  containerModals.style.display = "none";

});

}
displayModal2();

// preview de l'image 

const previewImg = document.querySelector(".container-file img");
const inputFile = document.querySelector(".container-file input");
const labelFile = document.querySelector(".container-file label");
const iconFile = document.querySelector(".container-file .fa-image");
const pFile = document.querySelector(".container-file p");



inputFile.addEventListener("change",()=>{
  const file = inputFile.files[0]


  
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
              previewImg.src = e.target.result;
              previewImg.style.display = "flex";
              labelFile.style.display = "none";
              iconFile.style.display = "none";
              pFile.style.display = "none";
      }
     
      reader.readAsDataURL(file);
  
  }
});


// creer une liste de categories dans l'input select

async function displayCategoryModal () {
  const select = document.querySelector(".modal-ajout select");
  const categorys = await getCategorys();
  categorys.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name
    select.appendChild(option);
  })
}
displayCategoryModal();


// faire un POST pour ajouter une photo

const form = document.querySelector(".modal-ajout form");
const title = document.querySelector(".modal-ajout #title");
const category = document.querySelector(".modal-ajout #category-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("category", category.value);
  formData.append("image", inputFile.files[0]);

      const token = window.sessionStorage.getItem("token");
     
      const response = await fetch("http://localhost:5678/api/works/", {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`
          },
          body: formData,
      });
    
      const data = await response.json();
    
    
     
     
     affichageWorks();
    displayGalerieModal();

 
});


// fonction qui verifie si tout les inputs sont remplis

function formCompleted()  {
 
  const buttonValidForm = document.querySelector(".modal-ajout button");
 
  console.log(inputFile.files[0]);
  if (title.value !== "" && inputFile.files[0] !== undefined && category.value !== "") {
    
      buttonValidForm.classList.remove("button-modal-2");
      buttonValidForm.classList.add("button-modal-2-active");
      
      
      buttonValidForm.addEventListener("click", () => {
          containerModals.style.display = "none";
      });           

  } else {
      buttonValidForm.classList.remove("button-modal-2-active");
      buttonValidForm.classList.add("button-modal-2");
   
      
  }
 
}
formCompleted();

title.addEventListener("change",formCompleted);
category.addEventListener("change",formCompleted);
inputFile.addEventListener("change",formCompleted);