let grid = []
let rs, speed, interval, fr
const n = 20

function lexicon(num=code.value) {
    fetch("https://cdn.jsdelivr.net/gh/GreyBeard42/conway@main/lexicon.json")
    .then(file => data = file.json())
    .then(data => {
        grid = data[num].txt
        slider.value = data[num].speed
        clearInterval(interval)
        if(slider.value != 0) interval = setInterval(tick, (10-slider.value)*100)
    })
    .then(() => {
        let i = 0
        grid.forEach((g) => {
            if(typeof g === "object") g = grid[i][0]
            else g = grid[i]
            grid[i] = g
            for(z=0; z<n; z++) grid[i] = "."+grid[i]+"."
            i++
        })
        let temp = ""
        for(z=0; z<(grid[0].length); z++) temp+="."
        for(z=0; z<n; z++) {
            grid.unshift(temp)
            grid.push(temp)
        }
        let y = 0
        grid.forEach((s) => {
            grid[y] = s.split("")
            y++
        })
        rs=width/grid.length/2
    })
}

lexicon()

function setup() {
    let cnvs = createCanvas(windowWidth, windowHeight)
    cnvs.parent("canvas")
    textAlign(LEFT, BOTTOM)
    rectMode(CENTER)

    rs = width
    speed = 10-slider.value
    interval = setInterval(tick, speed*100)
    fr = 0
}

slider.addEventListener("input", () => {
    clearInterval(interval)
    if(slider.value != 0) interval = setInterval(tick, (10-slider.value)*100)
})

code.addEventListener("input", () => {
    lexicon(code.value)
})

function draw() {
    background(0)

    fill("white")
    if(frameCount%10===0) fr = frameRate()
    text(round(fr*100)/100, 10, height-10)
    translate(width/2,height/2)
    strokeWeight(width/10000*rs)
    let x = 0
    let y = 0
    grid.forEach((s) => {
        if(typeof s === "object") s.forEach((r) => {
            if(r == "o" || r=="O") rect((x-floor(grid[0].length/2))*rs, (y-floor(grid.length/2)-1)*rs, rs+1, rs+1)
            x++
        })
        x = 0
        y++
    })
    rs = (rs*(n/2-1)+width/abs(w()+h())*0.75)/n*2
}

function tick() {
    let output = []
    let x = 0
    let y = 0
    grid.forEach((s) => {
        output.push([])
        s.forEach((r) => {
            output[y].push("")
            let n = neighbors(x,y)
            if((r === "o" || r === "O") && (n < 2 || n > 3)) {
                output[y][x] = "."
            } else if(n==3 && r=='.') {
                output[y][x] = "o"
            } else {
                output[y][x] = r
            }
            x++
        })
        x = 0
        y++
    })
    grid = output
}

function neighbors(x, y) {
    let count = 0
    let dirs = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]
    dirs.forEach((c) => {
        let cx = c[0]+x, cy = c[1]+y
        if(cx >= 0 && cx < grid[0].length && cy >= 0 && cy < grid.length) if(grid[cy][cx] == "o" || grid[cy][cx] == "O") count++
    })
    
    return count
}

function w() {
    let output = grid[0].length
    let start = 0
    let end = output
    for(y=0; y<grid.length; y++) {
        let mode = "start"
        for(x=0; x<grid[0].length; x++) {
            if(mode === "start" && grid[y][x]!==".") {
                if(x>=start) start = x
                mode === "end"
            } else if(mode === "end" && grid[y][x]===".") {
                if(x<=end) end = x
            }
        }
    }
    output = grid[0].length-end-start

    return output
}

function h() {
    let output = grid.length
    let start = 0
    let end = output
    for(y=0; y<grid[0].length; y++) {
        let mode = "start"
        for(x=0; x<grid.length; x++) {
            if(mode === "start" && grid[x][y]!==".") {
                if(x>=start) start = x
                mode === "end"
            } else if(mode === "end" && grid[x][y]===".") {
                if(x<=end) end = x
            }
        }
    }
    output = grid.length-end-start

    return output
}
