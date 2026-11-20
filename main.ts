
namespace SpriteKind {
    export const Chip = SpriteKind.create()
    export const Terminal = SpriteKind.create()
}

// Variables generales
let nivel = 1
let desafioIniciado = false
let objetosMundo: Sprite[] = []

info.setScore(0)
info.setLife(3)

// Imagen del personaje BIT
function crearBIT(): Sprite {
    let bit = sprites.create(img`
        . . . . . 8 8 8 8 . . . . . .
        . . . 8 8 9 9 9 9 8 8 . . . .
        . . 8 9 9 9 9 9 9 9 9 8 . . .
        . . 8 9 f 9 9 9 9 f 9 8 . . .
        . . 8 9 9 9 9 9 9 9 9 8 . . .
        . . . 8 9 9 9 9 9 9 8 . . . .
        . . . . 8 8 9 9 8 8 . . . . .
        . . . . . 8 8 8 8 . . . . . .
        . . . . 8 8 . . 8 8 . . . . .
        . . . 8 8 . . . . 8 8 . . . .
        . . 8 8 . . . . . . 8 8 . . .
    `, SpriteKind.Player)

    controller.moveSprite(bit, 100, 100)
    bit.setStayInScreen(true)
    return bit
}

// Cargar cada mundo
function cargarMundo() {
    // Eliminar los objetos del mundo anterior
    for (let objeto of objetosMundo) {
        objeto.destroy()
    }

    objetosMundo = []
    desafioIniciado = false

    // Cambiar el escenario según el nivel
    if (nivel == 1) {
        scene.setBackgroundColor(9)
        game.showLongText("MUNDO 1: CIUDAD DE LOS BITS. Recupera los fragmentos de datos y aprende los dos dígitos del sistema binario.", DialogLayout.Bottom)
    } else if (nivel == 2) {
        scene.setBackgroundColor(11)
        game.showLongText("MUNDO 2: CIRCUITO DE POSICIONES. Descubre cuánto vale cada posición de un número binario.", DialogLayout.Bottom)
    } else if (nivel == 3) {
        scene.setBackgroundColor(8)
        game.showLongText("MUNDO 3: PORTAL DECIMAL. Aprende a convertir números decimales al sistema binario.", DialogLayout.Bottom)
    } else {
        scene.setBackgroundColor(15)
        game.showLongText("MUNDO 4: NÚCLEO DEL SISTEMA. Supera la prueba final y restaura la ciudad digital.", DialogLayout.Bottom)
    }

    // Crear a BIT
    let bit = crearBIT()
    objetosMundo.push(bit)

    // Crear fragmentos de energía
    let posiciones = [
        [30, 25],
        [65, 95],
        [105, 25],
        [130, 95]
    ]

    for (let posicion of posiciones) {
        let chip = sprites.create(img`
            . . 5 5 . .
            . 5 4 4 5 .
            5 4 5 5 4 5
            5 4 5 5 4 5
            . 5 4 4 5 .
            . . 5 5 . .
        `, SpriteKind.Chip)

        chip.setPosition(posicion[0], posicion[1])
        objetosMundo.push(chip)
    }

    // Crear el portal o núcleo del mundo
    let portal = sprites.create(img`
        . . . 8 8 8 8 . . .
        . . 8 9 9 9 9 8 . .
        . 8 9 8 8 8 8 9 8 .
        8 9 8 . . . . 8 9 8
        8 9 8 . . . . 8 9 8
        8 9 8 . . . . 8 9 8
        . 8 9 8 8 8 8 9 8 .
        . . 8 9 9 9 9 8 . .
        . . . 8 8 8 8 . . .
    `, SpriteKind.Terminal)

    portal.setPosition(150, 60)
    objetosMundo.push(portal)
}

// Recoger fragmentos
sprites.onOverlap(SpriteKind.Player, SpriteKind.Chip, function (player, chip) {
    chip.destroy()
    info.changeScoreBy(50)
    music.playTone(784, 100)
})

// Preguntas de cada mundo
function obtenerPreguntas(): string[][] {
    if (nivel == 1) {
        return [
            ["¿Qué dos dígitos utiliza el sistema binario? Escribe 0 y 1.", "0 y 1"],
            ["¿Cuántos dígitos diferentes utiliza el sistema binario?", "2"],
            ["¿Cuál es el dígito más pequeño del sistema binario?", "0"],
            ["¿Cuál es el dígito más grande del sistema binario?", "1"]
        ]
    } else if (nivel == 2) {
        return [
            ["¿Cuánto vale la primera posición desde la derecha?", "1"],
            ["¿Cuánto vale la segunda posición desde la derecha?", "2"],
            ["¿Cuánto vale la tercera posición desde la derecha?", "4"],
            ["¿Cuánto vale el número binario 1010 en decimal?", "10"]
        ]
    } else if (nivel == 3) {
        return [
            ["¿Cómo se escribe el decimal 2 en binario?", "10"],
            ["¿Cómo se escribe el decimal 5 en binario?", "101"],
            ["¿Cómo se escribe el decimal 8 en binario?", "1000"],
            ["¿Cómo se escribe el decimal 12 en binario?", "1100"]
        ]
    } else {
        return [
            ["¿Qué dos dígitos utiliza el sistema binario?", "0 y 1"],
            ["¿Cuál es el valor de la tercera posición desde la derecha?", "4"],
            ["¿Cuánto vale el número binario 1101 en decimal?", "13"],
            ["¿Cómo se escribe el decimal 10 en binario?", "1010"]
        ]
    }
}

// Activar el portal y resolver los desafíos
sprites.onOverlap(SpriteKind.Player, SpriteKind.Terminal, function (player, portal) {
    if (desafioIniciado) {
        return
    }

    desafioIniciado = true

    game.showLongText("¡BIT ha encontrado el acceso al siguiente mundo! Resuelve las cuatro preguntas para continuar.", DialogLayout.Bottom)

    let preguntas = obtenerPreguntas()
    let puntos = 100

    if (nivel == 4) {
        puntos = 150
    }

    for (let pregunta of preguntas) {
        let correcta = false

        while (!correcta && info.life() > 0) {
            let respuesta = game.askForString(pregunta[0])

            if (respuesta.trim().toLowerCase() == pregunta[1].toLowerCase()) {
                info.changeScoreBy(puntos)
                music.playTone(988, 150)
                game.showLongText("¡Respuesta correcta! +" + puntos + " puntos.", DialogLayout.Bottom)
                correcta = true
            } else {
                info.changeLifeBy(-1)

                if (info.life() > 0) {
                    game.showLongText("Respuesta incorrecta. Pierdes una vida. ¡Inténtalo nuevamente!", DialogLayout.Bottom)
                }
            }
        }

        if (info.life() <= 0) {
            game.gameOver(false)
            return
        }
    }

    portal.destroy()

    if (nivel < 4) {
        game.showLongText("¡Mundo completado! BIT está preparado para continuar su aventura.", DialogLayout.Bottom)
        nivel += 1
        cargarMundo()
    } else {
        game.showLongText("¡NÚCLEO RESTAURADO! Has recuperado todos los datos binarios.", DialogLayout.Bottom)
        game.showLongText("¡FELICITACIONES! Has completado Misión Binaria y salvado la ciudad digital.", DialogLayout.Bottom)
        game.gameOver(true)
    }
})

// Iniciar la aventura
cargarMundo()
