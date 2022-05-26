
fetch('http://localhost:3000/api/steamuser')
    .then(res => {
        console.log("fetch OK")
        //const nameP = document.getElementById('nameViewer').innerHTML = res[0]
        //const idP = document.getElementById('steamId').innerHTML = res[1]
    })
    /* .then(res => {
        const nameP = document.getElementById('nameViewer').innerHTML = res[0]
        const idP = document.getElementById('steamId').innerHTML = res[1]
    }) */
    .catch(error => console.log(error))