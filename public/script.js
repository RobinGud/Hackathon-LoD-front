let x0 = 29.6575
let y0 = 59.7974
let xMax = 30.55
let yMax = 60.0988

let id_point = 0
let points = []
// kronva
// let example_x = 30.3162
// let example_y = 59.9502

// xMax:yMax
// let example_x = 30.55
// let example_y = 60.0988

// 0:0
// let example_x = 29.6575
// let example_y = 59.7974

const getRandomFloatInRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

const getStringClassName = (size,color) => {
    let stringClassNames = ""
    if (size == 0) {
        stringClassNames += "small "
    }
    if (size == 1) {
        stringClassNames += "medium "
    }
    if (size == 2) {
        stringClassNames += "big "
    }
    if (color == 0) {
        stringClassNames += "red "
    }
    if (color == 1) {
        stringClassNames += "green "
    }
    if (color == 2) {
        stringClassNames += "blue "
    }

    return stringClassNames
}

document.addEventListener("DOMContentLoaded", function(event)
{
    window.onresize = function() {
        resize_info();
    };
});

const resize_info = () => {

    for(let i = 0; i < points.length; i++) {
        console.log(points[i])
        let point = document.getElementById(`${points[i].id}`)
        let info = CoorToDecart(points[i].long, points[i].lat, points[i].size, points[i].color)
        point.style.left = `${info[0]}px`
        point.style.top = `${info[1]}px`
    }
}

const getRandomEvent = () => {

    let size = Math.floor(getRandomFloatInRange(1, 4))
    let color = Math.floor(getRandomFloatInRange(1, 4))

    let random_long = getRandomFloatInRange(30, 30.55)
    let random_lat = getRandomFloatInRange(59.7974, 60.0988)

    return[random_long, random_lat, size, color]
}

const CoorToDecart = (long, lat, size, color) => {
    let img = document.getElementById("imgMap")
    widthMap = img.offsetWidth
    heightMap = img.offsetHeight
    console.log(long, x0, xMax, widthMap)
    let point_x = ((long - x0)/(xMax - x0)) * widthMap - 2.5 * (size + 1)
    let point_y = (heightMap - (lat - y0)/(yMax - y0) * heightMap) - 2.5 * (size + 1)
    console.log(point_x, point_y, size, color)
    return [point_x, point_y, size, color]
}

// var results = JSON.parse('./data.json')
// console.log(results);


// document.onclick = (e) => {
    const AddPoint = (data) => {
    let divMap = document.getElementById("map")
    //let event = getRandomEvent()
    let event = [data.lon, data.lat, data.size, data.event]
    point = CoorToDecart(event[0], event[1], event[2], event[3])
    id_point += 1
    points.push({id : `id${id_point}`, long : event[0], lat : event[1], size: event[2], color: event[3]})

    let divPoint = document.createElement("div")
    divPoint.className = "circle " + getStringClassName(point[2], point[3])
    divPoint.id = `id${id_point}`
    // Random points
    divPoint.style.left = `${point[0]}px`
    divPoint.style.top = `${point[1]}px`
    // Cursor points
    // divPoint.style.left = `${e.clientX}px`
    // divPoint.style.top = `${e.clientY}px`
    divMap.appendChild(divPoint)

    let NotCon = document.getElementById("notification")
    let Not = document.createElement("div")
    Not.className = "alert " + getStringClassName(-1, (point[3] + 1))
    Not.id = `id${id_point}`
    Not.innerHTML = "<h2>Title</h2><span class=\"closebtn\" onclick=\"this.parentElement.remove();\">&times;</span><p>This is an alert box.</p>"
    NotCon.prepend(Not)

    let divHide = document.getElementById(`id${id_point}`)
    setTimeout(() => {  divHide.classList.add("hide"); }, 2000 * (point[3] + 1))
}

const socket = new WebSocket("ws://localhost:5022/")

socket.onopen = function() {
    alert("Соединение установлено.");
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      alert('Соединение закрыто чисто');
    } else {
      alert('Обрыв соединения'); // например, "убит" процесс сервера
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason);
  };
  
  socket.onmessage = function(event) {
    let json = JSON.parse(event.data)
    if (json["method"] == "show") {
        json["data"].forEach(elem => {
            console.log(elem);
            AddPoint(elem);
        })
    } else {

    }
  };
  
  socket.onerror = function(error) {
    alert("Ошибка " + error.message);
  };

// let eventSource = new EventSource("wss://localhost:8889/");
// eventSource.onmessage = function(event) {
//   console.log("Новое сообщение", event.data);
// };
