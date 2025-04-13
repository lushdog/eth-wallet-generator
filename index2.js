const bip39 = require('bip39')
const { hdkey } = require('ethereumjs-wallet')
const fs = require('fs')

const WALLET_COUNT = 10000000 // 设置生成钱包的数量

// 检查地址最后6位是否都是数字6
const checkLastSixDigitsAreSix = (address) => {
  if (address.length < 6) {
    return false
  }
  
  const lastSixCharacters = address.slice(-6)
  return lastSixCharacters === '666666'
}

// 将结果写入文件
const writeResultToFile = (mnemonic, privateKey, address) => {
  const content = `
找到符合要求的地址:
Mnemonic: ${mnemonic}
Private Key: ${privateKey}
Address: ${address}
--------------------------------------
`
  fs.appendFileSync('result.txt', content, 'utf8')
  console.log(`已找到一个符合要求的地址并保存到 result.txt: ${address}`)
}

async function generateWallet() {
  console.log('开始寻找最后6位都是数字6的以太坊地址...')
  console.log('符合条件的地址将保存到 result.txt 文件中')
  console.log('程序将持续运行，不会中断...')
  
  // 确保 result.txt 文件存在
  if (!fs.existsSync('result.txt')) {
    fs.writeFileSync('result.txt', '最后6位都是数字6的以太坊地址:\n', 'utf8')
  }
  
  let count = 0
  let foundCount = 0
  
  while (count < WALLET_COUNT) {
    count++
    
    if (count % 1000 === 0) {
      console.log(`已尝试 ${count} 个地址... 已找到 ${foundCount} 个符合条件的地址`)
    }
    
    // 生成助记词
    const mnemonic = bip39.generateMnemonic()
    
    // 从助记词生成私钥
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const hdWallet = hdkey.fromMasterSeed(seed)
    const key = hdWallet.derivePath("m/44'/60'/0'/0/0")
    
    // 获取私钥和地址
    const wallet = key.getWallet()
    const privateKey = wallet.getPrivateKeyString()
    const address = wallet.getAddressString()
    
    // 检查地址最后6位是否都是数字6
    if (checkLastSixDigitsAreSix(address)) {
      foundCount++
      writeResultToFile(mnemonic, privateKey, address)
    }
  }
  
  console.log(`已完成 ${WALLET_COUNT} 个地址的检查，共找到 ${foundCount} 个符合条件的地址`)
  console.log('所有结果已保存到 result.txt 文件中')
}

generateWallet()
