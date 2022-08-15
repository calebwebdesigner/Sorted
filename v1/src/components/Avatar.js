// styles
import './Avatar.css';

export default function Avatar({ src }) {
  // backgroundImage is used instead of an img tag, so no matter what size/shape img the user uploads, we can get a nice circle from the center of that image to be the avatar
  return <div className="avatar" style={{ backgroundImage: `url(${src})` }}></div>;
}
