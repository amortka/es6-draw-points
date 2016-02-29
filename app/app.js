import main from './index.html';
import styles from './style.css';

import Point from './src/Point.class';
import Playground from './src/Playground.class';

(function() {
    
    var play = new Playground('playground');
    play.init();


    window.play = play;
}())