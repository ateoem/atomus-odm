import ICloneable from '../Common/IClonable';
import IEqualable from '../Common/IEqualable';

interface IAggregate extends IEqualable, ICloneable {} 
 
export default IAggregate;
