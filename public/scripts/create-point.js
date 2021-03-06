//popular informações de estado e cidade://

function populateUFs() {
  const ufSelect = document.querySelector("select[name=uf]")

  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then( res => res.json() ) //retornando um valor//
  .then ( states => {

    for( const state of states ) {
      ufSelect.innerHTML += `<option value= "${state.id}">${state.nome}</option>`

    }

    
  } )
}

populateUFs()
/*popular informações de cidades*/

function getCities(event) {
  const citySelect = document.querySelector("[name=city]")
  const stateInput = document.querySelector("[name=state]")

  const ufValue = event.target.value

  const indexOfSelectedState = event.target.selectedIndex //para saber qual foi//
  stateInput.value = event.target.options[indexOfSelectedState].text

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
   
  //limpar cidade antes de retorar pesquisa, bug//
  citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
  citySelect.disabled = true

  fetch(url)
  .then( res => res.json() ) //retornando um valor//
  .then ( cities => {

    for( const city of cities ) {
      citySelect.innerHTML += `<option value= "${city.nome}">${city.nome}</option>`
    }

    citySelect.disabled = false

    
  } )

}

document
  .querySelector("select[name=uf]")
  .addEventListener("change", getCities)

//Itens de coleta
//pegar todos s li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items")

let selectedItems = []

function handleSelectedItem(event){
  const itemLi = event.target

  //adicionar ou remover uma classe com javascript
  itemLi.classList.toggle("selected") 

  const itemId = event.target.dataset.id
  
 //console.log('ITEM ID:', itemId) //para ver o que ele ta fazendo

  //verificar se existem itens selecionados, se sim
  //pegar os itens selecionados

  const alreadySelected = selectedItems.findIndex( item => {
    const itemFound = item == itemId //true ou false
    return itemFound
  })
  
  //se ja estiver selecionado, tirar da seleção
  if(alreadySelected >=0) {
    //tirar da selecao
    const filteredItems = selectedItems.filter( item => {
       const itemIsDifferent = item != itemId //false
       return itemIsDifferent
    })

    selectedItems = filteredItems

  } else{
      //se não estiver selecionado
      //adicionar a seleção
      selectedItems.push(itemId)
  }
  
 //console.log('selectedItems: ', selectedItems)

  //atualizar o campo escondido com os itens selecionados
  collectedItems.value = selectedItems

}