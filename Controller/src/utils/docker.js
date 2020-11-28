const { execSync } = require('child_process')
const os = require('os')

const Docker = Object.freeze({
  runProbeContainer: async (containerName, containerId, serverId, languages, percentages, country) => {
    /* Cannot use -it flag here */
    const cmd = [
      `docker run -d --rm --cap-add=NET_ADMIN --cap-add=SYS_MODULE --device /dev/net/tun --name ${containerName}`,
      '--sysctl net.ipv4.conf.all.rp_filter=2',
      '--ulimit memlock=-1:-1',
      '--network twitch-net',
      '-e USER=jasonliu9672@gmail.com -e PASS=\'ntur08921067\'',
      `-e CONNECT=${serverId} -e LANGUAGE=${languages.join(',')} -e PERCENTAGES=${percentages.join(',')}`,
      '-e TECHNOLOGY=NordLynx',
      `-e COUNTRY=${country.replace(/ /g, '_')}`,
      `-e CONTROLLER_IP=${os.networkInterfaces().eth0[0].address}`,
      `-e ID=${containerId}`,
      '-v /home/nslab/Desktop/netwatcher:/home/netwatcher',
      '-v /home/nslab/Desktop/envFiles/.bashrc:/root/.bashrc',
      '-v /home/nslab/Desktop/envFiles/resolv.conf:/etc/resolv.conf',
      'nslab/prober:official'].join(' ')
    try {
      await execSync(cmd)
      const stdout = await execSync('docker ps')
      if (stdout.toString().includes(containerName)) {
        return true
      }
      return false
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  killProbeContainer: async (containerName) => {
    try {
      await execSync(`docker stop ${containerName}`)
      const stdout = await execSync('docker ps')
      if (!stdout.toString().includes(containerName)) {
        return true
      }
      return false
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  listProbeContainers: async () => {
    // const list = await promisified_exec( `docker ps`)
    try {
      const stdout = await execSync('docker ps')
      return stdout.toString().match(/(probe-)\w{9}/g)
    } catch (e) {
      console.log(e)
      throw e
    }
  }
})
module.exports = Docker

if (require.main === module) {
  // const docker = Docker
  // docker.runProbeContainer('test', 'tw46', 'zh')
  // console.log(os.networkInterfaces().eth0[0].address)
}
