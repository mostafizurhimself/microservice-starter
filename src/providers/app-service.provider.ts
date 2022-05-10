import ServiceProvider from './service-provider';

export default class AppServiceProvider extends ServiceProvider {
  register() {
    // Add your dependency injections here
    // Example: Container.set('post.repository', new PostRepository());
  }
}
