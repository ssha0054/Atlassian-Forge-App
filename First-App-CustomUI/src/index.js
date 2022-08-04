import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);

    return 'Change made while tunneling!';
});

export const handler = resolver.getDefinitions();

