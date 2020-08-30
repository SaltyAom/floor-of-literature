import { render, fireEvent } from '@testing-library/react'

import Button from '@frontend/components/button'

describe("Button", () => {    
    it("should render successfully", () => {
        let { baseElement } = render(
            <Button>
                Click
            </Button>
        )

        expect(baseElement).toBeTruthy()
    })

    it("should render children", () => {
        let { baseElement} = render(
            <Button>
                <h1 className="title">Click</h1>
            </Button>
        ),
        title = baseElement.querySelector(".title")

        expect(title).toBeTruthy()
    })

    it("should be able to be fluid", () => {
        let { baseElement } = render(
            <Button fluid>
                Click
            </Button>
        ),
        button = baseElement.querySelector(".button"),
        fluid = button.classList.contains("-fluid")

        expect(fluid).toBeTruthy()
    })

    it("should be able to be primary", () => {
        let { baseElement } = render(
            <Button primary>
                Click
            </Button>
        ),
        button = baseElement.querySelector(".button"),
        primary = button.classList.contains("-primary")

        expect(primary).toBeTruthy()
    })

    it("should be able to be spaced", () => {
        let { baseElement } = render(
            <Button space>
                Click
            </Button>
        ),
        button = baseElement.querySelector(".button"),
        primary = button.classList.contains("-space")

        expect(primary).toBeTruthy()
    })

    it("should be able to be link", () => {
        let { baseElement } = render(
            <Button asLink href="/hello">
                Click
            </Button>
        ),
        button = baseElement.querySelector("a"),
        href = button.getAttribute("href")

        expect(href).toBe("/hello")
    })

    it("should be able to be transparent", () => {
        let { baseElement } = render(
            <Button transparent>
                Click
            </Button>
        ),
        button = baseElement.querySelector(".button"),
        transparent = button.classList.contains("-transparent")

        expect(transparent).toBeTruthy()
    })

    it("should be clickable", () => {
        let clicked = false

        let { baseElement } = render(
            <Button onClick={() => {
                clicked = true
            }}>
                Click
            </Button>
        ),
        button = baseElement.querySelector(".button")

        fireEvent(button, new MouseEvent('click', {
            bubbles: true
        }))

        expect(clicked).toBe(true)
    })
})