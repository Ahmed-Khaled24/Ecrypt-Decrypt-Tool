import { scrypt, randomFill, createCipheriv } from 'node:crypto-js';
import {createReadStream,createWriteStream} from 'node:fs';

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
     * @memberof AES
     */
    constructor(algorithm, password,inFile,outFile){
        // 
        this.algorithm = algorithm;
        this.password = password;
        this.file = inFile;
        this.outputFile = outFile
        this.keyLength = this.getKeyLength()
    }
    encrypt (){
        // do the encryption on the passed file
        
    }
    decrypt(){
        // do the decryption on the passed file
    }
    getKeyLength(){
        // helper function to get the length of the key from the given algorithm 
    }
}

module.exports = AES;
