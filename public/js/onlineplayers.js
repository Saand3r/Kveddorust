var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

fetch('http://localhost:3000/onlineplayers')
    .then(res => {
        if (res.ok) { 
            console.log("Fetch request successfull")
        }
        else { console.log("Fetch not sucessfull") }
        return res
    })
    .then(res => res.json())
    .then((res => {
        const getP = document.getElementById("online")
        getP.innerHTML = res[0]
        const utcSeconds = res[1]
        const d = new Date(0)
        d.setUTCSeconds(utcSeconds)
        const getPp = document.getElementById("wipe-info")
        const getDiv = document.getElementById("loading")
        getPp.title = "Last wiped: " + d
        const progressBar = document.getElementById("progressbar").style.width = getP.innerText + "%"
        const mapType = document.getElementById("maptype").innerHTML = res[2]
        getDiv.classList.add("visually-hidden")
    }))
    .catch(error => console.log(error))

