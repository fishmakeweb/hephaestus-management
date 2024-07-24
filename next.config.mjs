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

        if (!isServer) {
            config.module.rules.push({
                test: /\.(mp3|wav|mpe?g|ogg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: '/_next/static/media/',
                        outputPath: 'static/media/',
                        name: '[name].[ext]',
                        esModule: false,
                    },
                }],
            });
        }

        return config;
    },
};

export default nextConfig;
