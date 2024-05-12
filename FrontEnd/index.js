

//  l’appel à l’API avec fetch pour recuperer les données du backend 

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();

}
getWorks();




// ajouter à la galerie les travaux de l’architecte 

const gallery = document.querySelector(".gallery");

async function affichageWorks() {
  const works = await getWorks();

  // supprimez du html les travaux déja existant 

  gallery.innerHTML = "";
 
}
affichageWorks();



// affichage des boutons par categories

// récupérer les categories et les afficher 

const filters = document.querySelector(".filters")

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
 }
 
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

// filter au click sur le bouton par catégorie

async function filterCategory() {
  const images = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        btnId = e.target.id;
        gallery.innerHTML = "";
          if (btnId !== "0") {
            const triImages = images.filter((work) => {
              return work.categoryId == btnId;
             });
             
        }else {
          affichageWorks();
        }
      });
  });
}

filterCategory();










