import * as React from 'react';
import { render } from 'react-dom'
import {createProvider} from 'koa-cola/client'

var Provider = createProvider(
    [
	{
		"component": "index",
		"path": "/"
	},
	{
		"component": "fillForm",
		"path": "/fillForm"
	}
]
,{
    'index' : require('./pages/index').default,
'fillForm' : require('./pages/fillForm').default,
} 
    , require('../config/reduxMiddlewares').reduxMiddlewares
);

render(<Provider />, document.getElementById('app'))