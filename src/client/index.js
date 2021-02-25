// imports js files
import { handleSubmit } from './js/formHandler'
// import { isValidURL } from './js/isValidURL'

// import scss files
import './styles/styles.scss'

// start after the app fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // console.log('Hello there')
    
    // get the form
    const form = document.getElementById('tripForm')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        handleSubmit(e)
        // console.log(e.target)
    })
});

export { handleSubmit }