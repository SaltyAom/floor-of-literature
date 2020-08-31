import { render, fireEvent } from '@testing-library/react'

import Sign from '@frontend/layouts/sign'

describe("Sign Layout", () => {
    it("should render successfully", () => {
        let { baseElement } = render(
            <Sign>
                <h1>Hello World</h1>
            </Sign>
        )

        expect(baseElement).toBeTruthy()
    })

    it("should render children", () => {
        let { baseElement } = render(
            <Sign>
                <h1 className="title">Hello World</h1>
            </Sign>
        ),
            title = baseElement.querySelector(".title")

        expect(title).toBeTruthy()
    })

    it("shold be able to accept action", () => {
        let { baseElement } = render(
            <Sign action="POST">
                <h1 className="title">Hello World</h1>
            </Sign>
        ),
            form = baseElement.querySelector("#sign-layout")

        expect(form.getAttribute("action")).toBe("POST")
    })

    it("should use custom submit", () => {
        let customSubmit = false

        let { baseElement } = render(
            <Sign onSubmit={() => {
                customSubmit = true
            }}>
                <h1 className="title">Hello World</h1>
            </Sign>
        ),
            form = baseElement.querySelector("#sign-layout")

        fireEvent.submit(form)

        expect(customSubmit).toBe(true)
    })
})