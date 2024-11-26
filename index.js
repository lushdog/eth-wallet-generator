const bip39 = require('bip39')

const { hdkey }  = require('ethereumjs-wallet')


const WALLET_COUNT = 10000 // 设置生成钱包的数量


const areLastFourCharactersSame = (str, size) => {

  if (str.length < size) {

    return false // 如果字符串长度小于4，无法比较最后四个字符

  }


  const lastFourCharacters = str.slice(-size) // 获取字符串的最后四个字符


  // 使用数组的every方法来检查这四个字符是否都相同

  return lastFourCharacters.split('').every((char, index, array) => {

    return char === array[0]

  })

}


async function generateWallet() {

  for (let i = 0; i < WALLET_COUNT; i++) {

    // 生成助记词

    const mnemonic = bip39.generateMnemonic()

    console.log('Wallet', i + 1)


    // 从助记词生成私钥

    const seed = await bip39.mnemonicToSeed(mnemonic)

    const hdWallet = hdkey.fromMasterSeed(seed)

    const key = hdWallet.derivePath("m/44'/60'/0'/0/0")


    // 获取私钥和地址

    const wallet = key.getWallet()

    const privateKey = wallet.getPrivateKeyString()

    const address = wallet.getAddressString()


    // 后四位一样的打印出来，4可以改成其他数字

    if (areLastFourCharactersSame(address, 4)) {

      console.log('已经找到符合要求的地址:')

      console.log('Mnemonic:', mnemonic)

      console.log('Private Key:', privateKey)

      console.log('Address:', address)

      console.log('--------------------------------------')

      break

    }

  }

}


generateWallet()

