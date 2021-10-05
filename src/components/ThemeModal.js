import React from 'react';
import '../css/ThemeModal.css';

function ThemeModal({themeModal, setThemeModal}) {
    
    const pickBackground = () => {
        alert("se")
    }

    const ThemeModalOpen = () => {
        return(
        <div className="themeModal__container">
            <div onClick={() => setThemeModal(false)} className="themeModal__outer"></div>
            <div className="themeModal__inner">
                <div className="themeModal__inner--header">
                    <h3>Background</h3>
                </div>
                <div className="themeModal__inner--backImgs">
                    <div className="themeModal__inner--backImg">
                        <img src="https://img.freepik.com/free-vector/simple-background-with-gray-blue-leaves_52683-25363.jpg?size=626&ext=jpg"/>
                        <img src="https://png.pngtree.com/thumb_back/fh260/background/20201019/pngtree-best-christmas-backgrounds-with-bokeh-and-snowflakes-image_425801.jpg" />
                        <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/painting-spring-zoom-background-design-templa-template-d74a6e524bc7305d9e367517af97ad11_screen.jpg?ts=1606920134" />
                        <img src="https://venngage-wordpress.s3.amazonaws.com/uploads/2018/09/Colorful-Circle-Simple-Background-Image-1.jpg"/>
                        <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnVuJTIwYmFja2dyb3VuZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
                        <img src="https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg" />
                        <img src="https://t4.ftcdn.net/jpg/03/24/93/31/360_F_324933141_WgPQPeuxUOW2RhXNZx6iTz9AyLFz2rKP.jpg" />
                        <img src="https://img.pixers.pics/pho_wat(s3:700/FO/21/39/11/17/6/700_FO213911176_5198dc01c95595799dba734bebc89ee2,700,467,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,417,jpg)/plush-blankets-tropical-bright-colorful-background-with-exotic-painted-tropical-palm-leaves-minimal-fashion-summer-concept-flat-lay.jpg.jpg" />
                    </div>
                </div>
                <div className="themeModal__inner--apply">
                    <button>Apply</button>
                    </div>
            </div>
        </div>
        )
    }

    return (
        <div>
            {themeModal && <ThemeModalOpen/>}
        </div>
    )
}

export default ThemeModal