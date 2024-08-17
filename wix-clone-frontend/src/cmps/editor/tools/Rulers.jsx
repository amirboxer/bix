
import React, { useState, useLayoutEffect, useEffect } from "react"

function Rulers({ editBoardRef }) {
    // states
    const [pageHeight, setPageHeight] = useState(null);

    //useEffect
    useEffect(() => {
        if (editBoardRef.current) {
            setPageHeight(editBoardRef.current.clientHeight);
        }
    }, [editBoardRef.current])

    function foo(len) {
        console.log(len);

        return Array(Math.floor(len / 10)).fill().map((_, i) =>
            <span className="ruler-graduation" key={i}>
                {i % 10 === 0 && i !== 0 ?
                    (i * 10).toString().split('').map((digit, idx) =>
                        <span
                            className="ruler-digit"
                            key={idx}
                            style={{
                                height: 10,
                                top: `${idx * 10 + 4}px`,
                            }}
                        >{digit}
                        </span>)
                    : ''}
            </span>);
    }

    return (
        <>
            <div
                style={{ height: pageHeight, }}
                className="ruler right-ruler"
            >
                {foo(pageHeight)}
            </div>


            <div className="ruler top-ruler"></div>
        </>
    )
}

export default Rulers