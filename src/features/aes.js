const { scrypt, randomFill, createCipheriv,scryptSync,createDecipheriv } = require('node:crypto');
const {createReadStream,createWriteStream} = require('node:fs');
const {pipeline,} = require('node:stream');
const path = require('path');
const { Buffer } = require('node:buffer');

class AES{
    /**
     * Creates an instance of AES.
     * @param {*} algorithm: algorthims that will be used for throught the Enc or Dec, Supported algorithms
     * aes-128-cbc       aes-128-ecb       aes-192-cbc       aes-192-ecb
       aes-256-cbc       aes-256-ecb
     * @param {*} password password used to generate key
     * @param {*} inFile  path for the file to do operation on it 
     * @param {*} outFile path to save the output of any of the used operation [Dec or Enc]
     * @param {*} keyLength key length that will be extracted from the given algorithm 
     * @param {*} mode aes mode such as cbc , ecb , ....
     * @memberof AES
     */
    constructor(algorithm, password,inFile,outFile){
        this.algorithm = algorithm;
        this.password = password;
        this.inFile = path.join(path.dirname(__dirname),inFile);
        this.outFile = path.join(path.dirname(__dirname),outFile);
        this.algorithmKeyLengths = [128,192,256]
        this.algorithmParts = this.algorithm.split('-')
        this.mode = this.algorithmParts[this.algorithmParts.length-1]
        this.keyLength = this.getKeyLength()
    }
    encrypt (callback){
        // do the encryption on the passed file
        if (!this.validateAlgorithm()){
            console.error(`Not valid algorithm`);
            callback(false);
            return;
        }
        scrypt(this.password, 'salt', this.keyLength, (scryptErr, key) => {
            if (scryptErr){
                console.log(`Error during key generation ${scryptErr}`);
                callback(false);
                return;
            }
            // Then, we'll generate a random initialization vector
            randomFill(new Uint8Array(16), (randomFillError, iv) => {
                if (randomFillError){
                    console.log(`Error during initialize iv ${randomFillError}`);
                    callback(false);
                    return;
                }
                let cipher;
                if (this.mode !== 'ecb'){
                    cipher = createCipheriv(this.algorithm, key, iv);
                }
                else{
                    cipher = createCipheriv(this.algorithm, key, null);
                }
          
                const input = createReadStream(this.inFile);
                const fileName = path.basename(this.inFile);
                const output = createWriteStream(this.outFile+fileName+'.enc');
                pipeline(input, cipher, output, (pipelineError) => {
                    if (pipelineError){
                        console.log(`Error during Encryption Process ${pipelineError}`);
                        callback(false);
                        return;
                    }
                    console.log(`Encryption Process completed successfully!`);
                    callback(true);
                    return;
                });
            });
          });
    }
    decrypt(callback){
        // do the decryption on the passed file
        if (!this.validateAlgorithm()){
            console.error(`Not valid algorithm`);
            callback(false);
            return;
        }
        scrypt(this.password, 'salt', this.keyLength, (scryptErr, key) => {
            if (scryptErr){
                console.log(`Error during key generation ${scryptErr}`);
                callback(false);
                return;
            }
            // Then, we'll generate a random initialization vector
            
            const iv = Buffer.alloc(16, 0);
            let decipher;
            if (this.mode !== 'ecb'){
                decipher = createDecipheriv(this.algorithm, key, iv);
            }
            else{
                decipher = createDecipheriv(this.algorithm, key, null);
            }
            
            const input = createReadStream(this.inFile);
            const fileName = path.basename(this.inFile).split('.enc')[0];
            const output = createWriteStream(this.outFile+'dec_'+fileName);
            pipeline(input, decipher, output, (pipelineError) => {
                if (pipelineError){
                    console.log(`Error during Decryption Process ${pipelineError}`);
                    callback(false);
                    return;
                }
                console.log(`Decryption Process completed successfully!`);
                callback(true);
                return;
            });
        
          });
        return;
    }
    /**
     *  aes-128-cbc: Uses a 128-bit key (16 bytes)
        aes-128-ecb: Also uses a 128-bit key (16 bytes)
        aes-192-cbc: Uses a 192-bit key (24 bytes)
        aes-192-ecb: Also uses a 192-bit key (24 bytes)
        aes-256-cbc: Uses a 256-bit key (32 bytes)
        aes-256-ecb: Also uses a 256-bit key (32 bytes)
     *
     * @return {*} 
     * @memberof AES
     */
    getKeyLength(){
        // helper function to get the length of the key from the given algorithm 
        // const [,num,] = this.algorithm.toLowerCase().split('-');
        return parseInt(this.algorithmParts[1]/8,10)
    }
    validateAlgorithm(){
        const [aes,num,type] = this.algorithmParts
        if (aes !== 'aes' || (type !== 'cbc' && type !=='ecb') || !this.algorithmKeyLengths.includes(parseInt(num,10)))
            return false
        return true
    }
}

module.exports = AES