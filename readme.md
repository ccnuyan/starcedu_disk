# features

# how to use

## global scope modules  
    npm i -g babel-cli react-native-cli webpack webpack-dev-server webpack eslint mocha nodemon electron

## homebrew
    brew cask install visual-studio-code expo-xde java android-sdk
if there is 
    Warning: File /home/xxxx/.android/repositories.cfg could not be loaded.
then
    touch /home/xxxx/.android/repositories.cfg

## modules
    npm i

## chrome 
    chrome://flags/#allow-insecure-localhost
allow

## about .babelrc
no `.babelrc` and `*.js` in root directory;  
no babel configuration in code;  
file `.babelrc ` could be only in each subdirectory of root; 

## dev mode
    npm run fe-dev  // frontend  
    npm run wp-dev  // webpack

## nginx-config
    server {
        # server entry
        listen  80;
        location / {
            # frontend
            proxy_pass http://localhost:18000/;
        }
    }

## pages

[Home](http://localhost:8000/)  
[Home App](http://localhost:8000/app)  
[Help](http://localhost:13000/help)

## prod mode
`npm start`

## vscode plugin
    eslint

## deployment

## docker deployment
...