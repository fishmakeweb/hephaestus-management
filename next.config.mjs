import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    images: {
        domains: [
            'ap-south-1.linodeobjects.com',
            'diamondshop-img.ap-south-1.linodeobjects.com',
        ],
    },
    output: "standalone",
    webpack: (config, { isServer }) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    },
};

export default nextConfig;