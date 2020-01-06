class Logger {
  constructor () {
    this._prefix = '';
    this.PREFIX_TYPES = {
      GATEWAY: 'GATEWAY',
      STORE: 'STORE',
      CLIENT: 'CLIENT'
    };
  }

  log (options, ...content) {
    if (typeof options !== 'object') {
      options = {};
    }
    const { type = 'info', useTypeExplicitly = false } = options;
    this.icons = {
      error: 'x',
      warn: '!',
      info: 'i',
      debug: '#'
    };
    this.colors = {
      error: '#e53935',
      warn: '#ffa000',
      info: '#bdbdbd',
      debug: '#f06292'
    };
    this.backgroundColors = {
      debug: 'rgba(244, 67, 54, 0.05)'
    };

    const css = `font-weight: 800; color: ${this.colors[type]}; ${this.backgroundColors[type] ? `display: block; background-color: ${this.backgroundColors[type]}` : ''}`;
    console[useTypeExplicitly ? type : 'log'](`%c( ${this.icons[type]} )${this._prefix ? ` [ ${this._prefix} ]` : ''}`, css, ...content);
    this.prefix('');
  }

  prefix (content) {
    this._prefix = content;
    return this;
  }

  error (...content) {
    return this.log({ type: 'error', useTypeExplicitly: true }, ...content);
  }

  warn (...content) {
    return this.log({ type: 'warn', useTypeExplicitly: true }, ...content);
  }

  debug (...content) {
    return this.log({ type: 'debug' }, ...content);
  }

  info (...content) {
    return this.log({ type: 'info' }, ...content);
  }
}

export default Logger;
