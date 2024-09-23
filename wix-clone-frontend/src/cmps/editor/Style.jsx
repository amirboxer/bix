import { memo } from "react"
const Style = memo(function Style() {
    return (
        <style>{`
            .h1 {
                font-size: 36px;
                color: #000000;
                overflow-wrap: break-word;
                max-width: max-content;
            }

            .h2 {
                font-size: 31px;
                color: #000000;
            }
            .h3 {
                font-size: 28px;
                color: #000000;
            }
            .h4 {
                font-size: 26px;
                color: #000000;
            }
            .h5 {
                font-size: 22px;
                color: #000000;
            }
            .h6 {
                font-size: 18px;
                color: #000000;
            }
            `
        }
        </style>
    )
})

export default Style