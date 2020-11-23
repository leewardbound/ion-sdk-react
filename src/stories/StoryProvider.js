import React from "react";
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";

import {IonProvider} from "../components";
import IonUserMediaProvider from "../components/IonUserMediaProvider";

const theme = createMuiTheme({});

export default function StoryProvider({
                                          children,
                                          debug,
                                      }) {
    const canvas = React.createRef();
    const [stream, setStream] = React.useState();
    let frameCount = 0;

    let rectState = [0, 0, 10];
    let rectStateVector = [1, 1, 1];
    let colorSeed = Math.random() * 3600 * 1000

    const onFrame = () => {
        if (!canvas.current) return
        const ctx = canvas.current.getContext('2d')

        let date = new Date();

        // Rotate hue every hour
        let hue = Math.floor((((colorSeed + date.getTime()) % (60 * 60 * 1000)) / (60 * 60 * 1000)) * 360);

        // Rotate saturation every 5 seconds
        let sat = Math.floor(((colorSeed + date.getTime()) % 5000) / 5000 * 100);

        // Rotate luminance every 20 seconds
        let lum = Math.floor(((colorSeed + date.getTime()) % 20000) / 20000 * 100);

        // Rotate angle every minute
        let angle = (((date.getTime() % (60 * 1000)) / (60 * 1000)) * 360) * Math.PI / 180;


        ctx.resetTransform();

        ctx.filter = 'blur(1px)';
        ctx.drawImage(canvas.current, 0.5, 0, canvas.current.width - 1, canvas.current.height - 0.5);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;


        ctx.fillText(date.toISOString() + '  Frame: ' + frameCount.toLocaleString(), canvas.current.width / 2, canvas.height / 2);
        ctx.strokeStyle = '#000';
        ctx.strokeText(date.toISOString() + '  Frame: ' + frameCount.toLocaleString(), canvas.current.width / 2, canvas.height / 2);

        ctx.translate(rectState[0], rectState[1]);
        ctx.rotate(angle);
        ctx.strokeStyle = 'hsl(' + hue + ', ' + sat + '%, ' + lum + '%)';
        ctx.strokeRect(-rectState[2] / 2, -rectState[2] / 2, rectState[2], rectState[2]);
        if (rectState[0] >= canvas.current.width) {
            rectStateVector[0] = -1;
        }
        if (rectState[0] <= 0) {
            rectStateVector[0] = 1;
        }
        if (rectState[1] >= canvas.current.height) {
            rectStateVector[1] = -1;
        }
        if (rectState[1] <= 0) {
            rectStateVector[1] = 1;
        }
        if (rectState[2] >= 200) {
            rectStateVector[2] = -1;
        }
        if (rectState[2] <= 5) {
            rectStateVector[2] = 1;
        }
        for (let i = 0; i < rectState.length; i++) {
            rectState[i] += rectStateVector[i] * 1;
        }
    }

    let interval

    React.useEffect(() => {
        setInterval(onFrame, 30)
        if(!stream && canvas.current)
            setStream(canvas.current.captureStream(30))
        return () => interval && clearInterval(interval)
    })

    return (
        <div>
            <IonUserMediaProvider>
                <IonProvider
                    debug={debug}
                >
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </IonProvider>
            </IonUserMediaProvider>
        </div>
    );
}
