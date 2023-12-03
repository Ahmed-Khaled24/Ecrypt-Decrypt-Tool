const { scrypt, randomFill, createCipheriv } = require('node:crypto');
const {createReadStream,createWriteStream} = require('node:fs');

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
        this.algorithmKeyLengths = [128,192,256]
        this.isValidAlgorithm = this.validateAlgorithm()
        this.keyLength = this.getKeyLength()
    }
    encrypt (){
        // do the encryption on the passed file
        
    }
    decrypt(){
        // do the decryption on the passed file
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
        const [,num,] = this.algorithm.toLowerCase().split('-');
        return parseInt(num/8,10)
    }
    validateAlgorithm(){
        const [aes,num,type] = this.algorithm.toLowerCase().split('-');
        if (aes !== 'aes' || (type !== 'cbc' && type !=='ecb') || !this.algorithmKeyLengths.includes(parseInt(num,10)))
            return false
        return true
    }
}

module.exports = AES