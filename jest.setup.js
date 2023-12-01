// jest.setup.js
import {exec} from "child_process";


// Start the Solid server before running tests
beforeAll((done) => {
    const solidServer = exec(
        'npx @solid/community-server -c @css:config/file.json -f solid-server/',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error starting Solid server: ${error}`);
                done();
            } else {

                console.log(`Solid server started: ${stdout}`);
                done();
            }
        }
    );

    // You might need to wait for the server to start before calling done()
    // setTimeout(done, 5000); // Adjust the timeout based on your server startup time
});

// Stop the Solid server after running tests
afterAll(() => {
    solidServer.kill();
});