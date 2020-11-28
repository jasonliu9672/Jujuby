import {isValidCountry} from '../../utils/nordvpn/index.js'
import Id from '../../utils/unique-id/index.js'
import buildCreateProbe from './probe.js'

const createProbe = buildCreateProbe({Id,isValidCountry})
export default createProbe