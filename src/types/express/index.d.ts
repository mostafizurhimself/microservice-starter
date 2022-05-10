declare namespace Express {
  export interface Request {
    wantsJson: () => boolean;
    props: {
      tenant: string;
      [key: string]: unknown;
    };
  }

  export interface Response {
    cleanTmp: () => this;
  }
}
declare module 'mongoose-slug-generator';
