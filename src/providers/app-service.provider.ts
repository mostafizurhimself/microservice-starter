import { Provider } from '@/contracts/provider';

export default class AppServiceProvider implements Provider {
  register() {
    // Add your dependency injections here
    // Example: Container.set('post.repository', new PostRepository());
  }
}
