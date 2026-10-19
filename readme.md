# timedle

Timedle is a  game in whicih you have to guess the country by its local time in 5 tries. If you scroll below the game, you might even learn some stuff about timezones ;)

## development process

Firstly, I designed a basic draft design in Figma.

![mock-img](./img/mock.png)

Using this image as a guide, I started coding a simple website that matches this layout and made it responsive so that the whole UI fits in a normal phone screen without having to scroll.

Then, for adding the map, I used MapLibre because I have used it in one of my [past projects](https://damakerdev.github.io/3d-globe-proj/).

With a working map inside the MAP container, I made it so that when you click on the map, the game logs the coordinates on the console. Then, I used the reverse geocoding api given by bigDataCloud and openMeteo to find out the country name and timezone identifier based on the clicked place on the map.
(the bigDataCloud api hit the limits too quick so switched to nominatim reverse geocoding api -_-)

Then, I made the website load a random timezone when the site loads and show a basic win/lose modal based on, if the user guesses the timezone within 5 tries or less.

After that, I spent most of the time improving the UI and feel of the game and finally made a working version of the game.

But, it felt a bit incomplete so then I added the learn timezones section by sleeping in figma for a long time and going on without touching grass for a week ;-; 

For the timezone map in the learn section, I have used amCharts v5 map editor which is an online map editor where you have to edit the map that you want and can get the code to make the map work in your site. I had to dig deep into its api to learn how to customize it and did quite a bit of customization to finally match the bright blue-green feel there is, in the other graphics.

While designing the learn section, I wanted a way to add meanings to the complex terms without having to go out of context from the paragraphs and thats when I found out about nutshell by ncase.me!! 


---

## Screenshots

![game screenshot](./img/gamess-1.png)
![game win screenshot](./img/game-ss2.png)
![game blog screenshot](./img/game-ss3.png)
![game blog screenshot](./img/game-ss4.png)

---

Happy Coding!!