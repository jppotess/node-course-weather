const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message = document.querySelector('message')
const message = document.querySelector('#forecast-message')

weatherForm.addEventListener('submit', e => {
  e.preventDefault()
  message.textContent = 'Loading...'

  const location = search.value

  fetch(`/weather?address=${location}`).then(response => {
    response.json().then(data => {
      if (data.error) {
        message.textContent = data.error
      } else {
        message.textContent = data.forecast
      }
    })
  })
})
